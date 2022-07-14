FROM node:16-alpine
LABEL maintainer="apwebsite"
RUN apk add --no-cache libc6-compat
RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime
RUN mkdir -p /app
WORKDIR /app
COPY . ./
RUN npm -g config set user root
RUN npm install pm2 -g
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:retain 7
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:max_size 50M
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:rotateInterval 0 0 * * *
RUN pm2 set pm2-logrotate:rotateModule true
RUN pm2 set pm2-logrotate:workerInterval 30
RUN yarn install
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn build
#RUN yarn build
EXPOSE 3000
CMD [ "pm2-runtime", "start", "ecosystem.config.js"]
