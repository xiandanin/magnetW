filepath=256x256.png
iconset=.icns.iconset

cd build/icons
if [ ! -d $iconset ];then
    mkdir $iconset
fi

sips -z 16 16 $filepath --out $iconset/icon_16x16.png
sips -z 32 32 $filepath --out $iconset/icon_16x16@2x.png
sips -z 32 32 $filepath --out $iconset/icon_32x32.png
sips -z 64 64 $filepath --out $iconset/icon_32x32@2x.png
sips -z 128 128 $filepath --out $iconset/icon_128x128.png
sips -z 256 256 $filepath --out $iconset/icon_128x128@2x.png
sips -z 256 256 $filepath --out $iconset/icon_256x256.png
sips -z 512 512 $filepath --out $iconset/icon_256x256@2x.png
sips -z 512 512 $filepath --out $iconset/icon_512x512.png
sips -z 1024 1024 $filepath --out $iconset/icon_512x512@2x.png

iconutil -c icns $iconset -o icon.icns
icotool -c $iconset/icon_256x256.png -o icon.ico
