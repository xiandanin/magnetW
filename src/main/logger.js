import logger from 'electron-log'
import moment from 'moment'
import util from 'util'

const level = process.env.NODE_ENV === 'development' ? 'debug' : 'silly'
logger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
logger.transports.console.level = level
logger.transports.file.fileName = `${moment().format('YYYY-MM-DD')}.log`
logger.transports.file.level = level

logger.transports.console = (msg) => {
  const time = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  const colour = levelStyles[msg.level]
  const header = colorize(util.format('[%s][%s]', time, msg.level), colour)
  const text = colorize(util.format(...msg.data), colour)
  const message = util.format('%s %s', header, text)
  console.log(message)
}

console.error = logger.error
console.warn = logger.warn
console.info = logger.info
console.verbose = logger.verbose
console.debug = logger.debug
console.silly = logger.silly

const levelStyles = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'blue',
  debug: 'cyan',
  silly: 'magenta'
}

const styles = {
  // styles
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  // grayscale
  white: [37, 39],
  grey: [90, 39],
  black: [90, 39],
  // colors
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [91, 39],
  yellow: [33, 39]
}

function colorizeStart (style) {
  return style ? `\x1B[${styles[style][0]}m` : ''
}

function colorizeEnd (style) {
  return style ? `\x1B[${styles[style][1]}m` : ''
}

/**
 * Taken from masylum's fork (https://github.com/masylum/log4js-node)
 */
function colorize (str, style) {
  return colorizeStart(style) + str + colorizeEnd(style)
}

export default logger
