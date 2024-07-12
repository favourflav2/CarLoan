FROM postgres:latest

# We add the tables folder we created with our table queries
# /docker-entrypoint-initdb.d/tables/ ... this is according to postgres image documentaion to extend this image so it is standard naming
# We are creating a folder table in our container 
ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD deploy_schemas.sql /docker-entrypoint-initdb.d/