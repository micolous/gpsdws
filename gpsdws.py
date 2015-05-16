#!/usr/bin/env python
# gpsdws.py - Simple WebSockets GPSd sharing tool
# Copyright 2015 Michael Farrell <micolous+git@gmail.com>
# 
# This library is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
# 
# You should have received a copy of the GNU Lesser General Public License
# along with this library.  If not, see <http://www.gnu.org/licenses/>.

from twisted.internet import reactor, ssl
from twisted.python import log
from twisted.web.server import Site
from twisted.web.static import File
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol
from autobahn.twisted.resource import WebSocketResource, HTTPChannelHixie76Aware
from autobahn.websocket.protocol import createWsUrl
from json import dumps, JSONEncoder
from os.path import dirname, join, abspath
import sys, gps


DEFAULT_GPSDWS_ROOT = abspath(join(dirname(__file__), 'gpsdws_root'))
DEFAULT_CERT = abspath(join(dirname(__file__), 'server.pem'))

class DictWrapperEncoder(JSONEncoder):
	def default(self, obj):
		if isinstance(obj, gps.dictwrapper):
			return dict(obj)

		return json.JSONEncoder.default(self.obj)


class GPSdWSProtocol(WebSocketServerProtocol):
	def onConnect(self, request):
		WebSocketServerProtocol.onConnect(self, request)
		self.factory.clients.append(self)


class GPSdWSProtocolFactory(WebSocketServerFactory):
	def __init__(self, *args, **kwargs):
		kwargs['server'] = 'gpsdws/0.1.0'
		WebSocketServerFactory.__init__(self, *args, **kwargs)
		self.clients = []
		reactor.callInThread(self.gps_processor)


	def gps_processor(self):
		self.gps = gps.gps()
		self.gps.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)
		for report in self.gps:
			reactor.callFromThread(self.broadcast_object, dict(report))
		
		# GPSD has stopped
		reactor.stop()
	
	def broadcast_object(self, msg):
		# format into json once
		msg = dumps(msg, cls=DictWrapperEncoder)
		print msg
		
		# broadcast
		for client in self.clients:
			client.sendMessage(msg)


def main(listen_addr='127.0.0.1', port=8947, gpsdws_www_root=DEFAULT_GPSDWS_ROOT, cert=DEFAULT_CERT):
	# Load server certificate
	certData = open(DEFAULT_CERT, 'rb').read()
	certificate = ssl.PrivateCertificate.loadPEM(certData)

	# Create server
	uri = createWsUrl(listen_addr, port)
	factory = GPSdWSProtocolFactory(uri, debug=False)
	factory.setProtocolOptions(allowHixie76=True, webStatus=False)
	factory.protocol = GPSdWSProtocol
	factory.clients = []

	resource = WebSocketResource(factory)
	root = File(gpsdws_www_root)
	root.putChild('gpsdws', resource)

	site = Site(root)
	site.protocol = HTTPChannelHixie76Aware
	reactor.listenSSL(port, site, certificate.options(), interface=listen_addr)

if __name__ == '__main__':
	log.startLogging(sys.stdout)
	reactor.callWhenRunning(main)
	reactor.run()

