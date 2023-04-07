from flask import (
    Blueprint, jsonify, request, current_app,
    render_template, url_for, redirect
    )
from flask_restful import Api, Resource, reqparse, abort
from flask_mail import Message

from server import pages, model, mail
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import smtplib
from . import history

bp = Blueprint('api',__name__,url_prefix='/api',template_folder='templates')
api = Api(bp)

@bp.route('/page/<path:path>')
def get_page(path):
    page = pages.get_or_404(path)
    return jsonify(dict(content=page))

#-- Email Handlers -------------------------------------------------

def send_creation_notify(user):

    users = model.User.query.filter_by(active=True)
    emails = [user.email for user in users]
    subject = 'New application received'

    if not emails:
        return

    msg = Message(subject,recipients=emails)

    msg.text = render_template('api/creation_notify.txt',user=user)
    msg.html = render_template('api/creation_notify.html',user=user)

    mail.send(msg)

def send_acknowledgment_email(user):

    subject = 'ISR Summer School application received'

    msg = Message(subject,recipients=[user.email])

    msg.text = render_template('api/acknowledgment.txt')
    msg.html = render_template('api/acknowledgment.html')

    mail.send(msg)

#-- Create Application -------------------------------------------------

class submit_application(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('firstname',required=True)
    parser.add_argument('lastname',required=True)
    parser.add_argument('email',required=True)
    parser.add_argument('phonenumber')
    parser.add_argument('university',required=True)
    parser.add_argument('city')
    parser.add_argument('state')
    parser.add_argument('country')
    parser.add_argument('field')
    parser.add_argument('degree')
    parser.add_argument('apptype',required=True)
    parser.add_argument('graduation',required=True)
    parser.add_argument('supervisor_name')
    parser.add_argument('supervisor_email')
    parser.add_argument('supervisor_phone')
    parser.add_argument('why_attend',required=True)
    parser.add_argument('experience',required=True)
    parser.add_argument('research_area',required=True)
    parser.add_argument('housing_pref')
    parser.add_argument('other')

    def post(self):
        data = self.parser.parse_args()

        data.apptype = model.AppType.query.filter_by(name=data.apptype).first_or_404()

        if data.housing_pref:
            data.housing_pref = model.HousingPref.query.filter_by(name=data.housing_pref).first_or_404()

        if data.degree:
            data.degree = model.Degree.query.filter_by(name=data.degree).first_or_404()

        data = model.filter_columns(model.Application,data)

        application = model.Application(**data)
        model.db.session.add(application)
        model.db.session.commit()

        send_creation_notify(application)
        #send_acknowledgment_email(application)

        name = data['firstname'] + ' ' + data['lastname']
        history.add_entry('system','Application received for %s' % name)

        return { 'message': 'Request submitted' },200

api.add_resource(submit_application,'/applications')

