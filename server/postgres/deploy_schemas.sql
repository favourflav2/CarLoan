-- Deploy fresh database tables
-- Order matter here if your tables depend on each other

\i '/docker-entrypoint-initdb.d/tables/auth.sql'
\i '/docker-entrypoint-initdb.d/tables/goals.sql'
\i '/docker-entrypoint-initdb.d/tables/contentCreator.sql'
\i '/docker-entrypoint-initdb.d/tables/videoLink.sql'
\i '/docker-entrypoint-initdb.d/tables/books.sql'