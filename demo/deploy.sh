set -e

rm -rf dist
rm -rf node_modules && rm -rf package-lock.json && npm i
npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:antoine92190/vue-advanced-chat.git main:gh-pages

cd -