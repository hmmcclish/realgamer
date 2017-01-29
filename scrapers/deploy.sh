DEPLOY_PATH=/tmp/realgamer-scraper-heroku/

rm -rf $DEPLOY_PATH
mkdir -p $DEPLOY_PATH

cd $DEPLOY_PATH
tree
git init
heroku git:remote -a realgamer-scraper
git pull heroku --rebase
cd -
rsync -av . $DEPLOY_PATH --exclude node_modules
cd $DEPLOY_PATH

git add -A .
git commit -am "deploy"
git push heroku master

echo "test: https://realgamer-scraper.herokuapp.com/launchbox/1234"