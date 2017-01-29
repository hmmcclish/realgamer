DEPLOY_PATH=$HOME/scraper-deploy-`date +%s`/

rm -rf $DEPLOY_PATH
mkdir -p $DEPLOY_PATH
rsync -av . $DEPLOY_PATH --exclude node_modules

cd $DEPLOY_PATH
git init
heroku git:remote -a realgamer-scraper
git add -A .
git commit -m "deploy"
git push -f heroku master

cd -
rm -rf $DEPLOY_PATH

echo "🚀  https://realgamer-scraper.herokuapp.com/launchbox/1234"