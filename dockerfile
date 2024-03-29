FROM node:16-bullseye-slim as Builder
LABEL maintainer="contact@kalisio.xyz"

ARG FLAVOR
ARG BUILD_NUMBER

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV NODE_APP_INSTANCE=$FLAVOR

# Copy the built artefact.
# Warning - 
# We could do ADD and let Docker uncompress automatically the archive but we reach log limit in Travis.
# So we copy the archive and uncompress it using tar without the verbose mode
COPY kalisio.tgz /opt/.
WORKDIR /opt
RUN tar zxf kalisio.tgz && rm kalisio.tgz

# Link the modules and run the app
# Use multisage build to forget the unused archive.tgz
FROM node:16-bullseye-slim
LABEL maintainer="contact@kalisio.xyz"

ARG APP
ARG FLAVOR
ARG BUILD_NUMBER

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV NODE_APP_INSTANCE=$FLAVOR

COPY --from=Builder /opt/kalisio /opt/kalisio

# Link the modules
WORKDIR /opt/kalisio
RUN node . ${APP}.js --link

# Run the app
WORKDIR /opt/kalisio/${APP}
EXPOSE 8081
CMD [ "yarn", "prod" ]
