set -e

rm -rf dist

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:antoine92190/vue-advanced-chat.git master:gh-pages

cd -