FROM mhart/alpine-node:10.15.3
# Set the working directory to /server
 WORKDIR /server
# # copy package.json into the container at /server
 COPY package*.json /server/
# # install dependencies
 RUN yarn install
# # Copy the current directory contents into the container at /server
 COPY . /server/
# # Make port 80 available to the world outside this container
 EXPOSE 4443
# # Run the app when the container launches
 CMD ["yarn", "start"]

