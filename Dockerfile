FROM node:16 As builder

# Create app directory, this is in our container/in our image
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/main" ]

# FROM node:12-alpine
# WORKDIR /app
# COPY --from=builder /app ./
# CMD ["npm", "run", "start:prod"]