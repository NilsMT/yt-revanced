# Description

This repository contain what I'm using to patch Youtube with ReVanced so it doesn't have ads and do all sort of cool stuff !

# Node.js Project

The node.js project contain a single command :

```sh
npm run build <youtube.apk>
```

> like `npm run build com.google.android.youtube_20.14.43.apk`

It will apply all the latest patches to the APK, Everything is downloaded automaticaly beside the APK.

In case it doesnt work because ReVanced repos got shutdown or something head to the next section

# Manual compilation

Run this command to compile a version of youtube thatyou downloaded (the version 20.14.43 has been tested)

> Replace `C:\Program Files\Java\jdk-24.0.2\bin\java.exe` with the location of your jdk binary `.exe`, take note of the compatibility listed in the [CLI documentation](https://github.com/ReVanced/revanced-cli/blob/main/docs/0_prerequisites.md)

```sh
& "C:\Program Files\Java\jdk-24.0.2\bin\java.exe" -jar "src/backup/revanced-cli-5.0.1-all.jar" patch -p "src/backup/patches-5.50.2.rvp" -o "build/YouTube_ReVanced.apk" <youtube.apk>
```

# External downloads

These are the links used to download required stuffs

> Manual
>
> - APK Download : https://www.apkmirror.com/apk/google-inc/youtube
>
> Automatic
>
> - CLI : https://github.com/ReVanced/revanced-cli/releases
> - Patches : https://github.com/ReVanced/revanced-patches/releases

# Side notes

> [This youtube apk](https://www.apkmirror.com/apk/google-inc/youtube/youtube-20-14-43-release/youtube-20-14-43-2-android-apk-download/download/?key=eef450560b0d36f4805e04edcacdf32b6ba39bfd&forcebaseapk=true#google_vignette) is working fine

> The [src/trash](./src/trash/) folder exist because I had stuff prior to creating the repo that I think is useful but I can't tell anymore
