from flask import (
    Blueprint, jsonify, request, current_app,
    render_template, url_for, redirect
    )
from flask_restful import Api, Resource, reqparse, abort

from server import pages, model, db

from . import database

bp = Blueprint('api',__name__,url_prefix='/api',template_folder='templates')
api = Api(bp)

@bp.route('/page/<path:path>')
def get_page(path):
    page = pages.get_or_404(path)
    return jsonify(dict(content=page))

class HandleLatest(Resource):

    def get(self, table_name):
        return database.get_latest(table_name)

class HandleDescriptors(Resource):

    def get(self):
        return database.get_descriptors() 

api.add_resource(HandleLatest, "/latest/<table_name>")
api.add_resource(HandleDescriptors, "/descriptors")
