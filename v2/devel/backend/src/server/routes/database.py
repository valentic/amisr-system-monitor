from sqlalchemy import MetaData 
from psycopg2 import sql
from server import db

from . import array_xml

def get_latest(table_name):
    engine = db.engines["amisr"]
    metadata = MetaData(bind=engine)
    metadata.reflect()

    view = f"{table_name}_latest" 

    if table_name == "array_data":
        query = f"select device_id, xmlbz from {view}" 
        rows = engine.execute(query).mappings().all()
        return array_xml.parse(rows)

    if table_name in metadata.tables:
        query = f"select json_agg(data) from {view} as data"
        return engine.execute(query).first()[0]

    return {}

def get_table(table_name):
    engine = db.engines["amisr"]

    sql = f"select json_agg(data) from {table_name} as data"

    result = {}

    for row in engine.execute(sql).all()[0][0]:
        key = f"{table_name}_id"
        result[row[key]] = row

    return result

def get_descriptors():

    return {
        "site": get_table("site"),
        "system": get_table("system"),
        "status": get_table("status"),
        "device": get_table("device"),
        "device": get_table("device"),
        "device_class": get_table("device_class"),
        "device_model": get_table("device_model"),
        "aeu_alarm": get_table("aeu_alarm")
    }

