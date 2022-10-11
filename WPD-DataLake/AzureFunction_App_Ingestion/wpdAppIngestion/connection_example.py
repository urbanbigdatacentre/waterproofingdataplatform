import psycopg2

def getconnection():
    # Update connection string information
    host = "path.to.host.dns"
    dbname = "dbname"
    user = "user@wpath.to.host.dns"
    password = "your_pass_word"
    sslmode = "require"


    # Construct connection string
    conn_string = "host={0} user={1} dbname={2} password={3} sslmode={4}".format(host, user, dbname, password, sslmode)
    conn = psycopg2.connect(conn_string)
    return conn