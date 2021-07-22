FROM python:3.7-stretch

ARG BUILD_ENV
ARG GRAPHICS
ARG CERTPATH

WORKDIR /app

# Install non-multiagent dependencies
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt
# Install multiagent dependencies
COPY ./multiagent_requirements.txt ./multiagent_requirements.txt
RUN pip install -r multiagent_requirements.txt

# Install eventlet production server if production build
RUN if [ "$BUILD_ENV" = "production" ] ; then pip install eventlet ; fi

# Copy multiagent code
COPY ./multiagent ./multiagent

RUN apt-get update
RUN apt-get install -y libgl1-mesa-dev

# Copy over remaining files
COPY ./static ./static
COPY ./*.py ./
COPY ./graphics/$GRAPHICS ./static/js/graphics.js
COPY ./config.json ./config.json

# Set environment variables that will be used by app.py
ENV HOST 0.0.0.0
ENV PORT 5000
ENV CONF_PATH config.json
ENV CERTPATH $CERTPATH

# Do the thing
EXPOSE 5000
CMD ["python", "-u", "app.py"]
