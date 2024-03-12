# Appstage.io Delete Files Github Action

![GitHub Release](https://img.shields.io/github/v/release/appstage-io/delete-files-action)

Github action to ease deletion of multiple files on [Appstage.io](https://www.appstage.io) project live builds.

## Usage

Add appstage-actions to the workflow to upload your new ipa or apk build to appstage. The below example builds an iOS installer using fastlane then deletes the previous ipa before uploading the new build to appstage.io:-

```yaml
name: "Build and Publish iOS"
on:
  push:
   branches: [ "master" ]

jobs:
  build:
    runs-on: macos-latest
    timeout-minutes: 30
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Update dependencies
        run: |
          bundle
          bundle update fastlane
          pod repo update

      - name: Build ipa with fastlane
        id: build_ipa
        run: bundle exec fastlane beta

      - name: List current files on Appstage.io
        uses: appstage-io/list-files-action@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}

      - name: Delete old ipa from Appstage.io
        uses: appstage-io/delete-files-action@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}
          pattern: '.ipa'

      - name: Deploy new ipa to Appstage.io
        uses: Appstage-io/actions/upload-files@master
        with:
          token: ${{ secrets.APPSTAGE_JWT }}
          folder: './build'
          pattern: '.ipa'
```

## Delete files

### Description

Delete all files matching the pattern on the Live builds release on Appstage.io.

### Example

```yaml
- name: Deploy new ipa's to Appstage.io
  uses: Appstage-io/actions/delete-files@master
  with:
    token: ${{ secrets.APPSTAGE_JWT }}
    pattern: '.ipa'
```

### Inputs

| Input | Required? | Default | Description |
| ----- | --------- | ------- | ----------- |
| token | true | |Project Access Token|
| pattern | false | .* | A regex pattern of files to delete|
