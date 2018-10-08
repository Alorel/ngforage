#!/usr/bin/env bash

PLAINTEXT_GPG=/tmp/alobuild-$(cat /proc/sys/kernel/random/uuid)

echo $BUILD_GPG_PUB_KEY | base64 -d > $PLAINTEXT_GPG
echo >> $PLAINTEXT_GPG
echo $BUILD_GPG_PRIV_KEY | base64 -d >> $PLAINTEXT_GPG
chmod 600 $PLAINTEXT_GPG
gpg --batch --yes --import $PLAINTEXT_GPG
rm -f $PLAINTEXT_GPG

PWD_GPG=/tmp/alobuild-$(cat /proc/sys/kernel/random/uuid)

echo '/usr/bin/gpg2 --passphrase ${BUILD_GPG_KEY_PWD} --batch --no-tty "$@"' > $PWD_GPG
chmod 700 $PWD_GPG

git config gpg.program $PWD_GPG
git config commit.gpgsign true
git config --global user.signingkey $BUILD_GPG_KEY_ID
