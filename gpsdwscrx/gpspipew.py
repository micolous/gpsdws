#!/usr/bin/env python
"""
Wraps gpspipe in order to pass Chrome Native Messaging protocol messages for gpspipe

https://developer.chrome.com/extensions/nativeMessaging
"""
from subprocess import *
from struct import pack
from sys import stdout

process = Popen(['gpspipe', '-w'], stdin=PIPE, stdout=PIPE)

try:
	while process.returncode is None:
		process.poll()
		line = process.stdout.readline()

		if len(line) == 0:
			# Drop empty lines
			continue

		# Lines from gpspipe are already json, yay!
		line = line.strip().encode('utf-8')

		# Protocol is to have a JSON blob preceeded with a uint32 in native byte
		# order.
		stdout.write(pack('=L', len(line)) + line)

		# Flush the output immediately.
		stdout.flush()
except KeyboardInterrupt:
	# Swallow the exception message
	pass
finally:
	# Make sure the child process is dead.
	try:
		process.kill()
	except:
		pass

