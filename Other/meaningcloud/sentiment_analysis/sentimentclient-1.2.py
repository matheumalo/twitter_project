# -*- encoding: utf-8 -*-
"""
 Sentiment Analysis 1.2 starting client for Python.

 In order to run this example, the license key must be included in the key variable.
 If you don't know your key, check your personal area at MeaningCloud (https://www.meaningcloud.com/developer/account/licenses)

 Once you have the key, edit the parameters and call "python sentimentclient-1.2.py"

 You can find more information at http://www.meaningcloud.com/developer/sentiment-analysis/doc/1.2

 @author     MeaningCloud
 @contact    http://www.meaningcloud.com (http://www.daedalus.es)
 @copyright  Copyright (c) 2015, DAEDALUS S.A. All rights reserved.
"""


import httplib
import urllib
import json

# We define the variables need to call the API
host = 'api.meaningcloud.com'
api = '/sentiment-1.2.php'
key = '9e062aedbc21839056d12f457513be2f'
txt = 'job and jobs are very important #job #jobs'
model = 'en-general' #// es-general/en-general/fr-general


# Auxiliary function to make a post request
def sendPost():
  params = urllib.urlencode({'key': key,'model': model, 'txt': txt, 'src': 'sdk-python-1.2'}) # management internal parameter
  headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
  conn = httplib.HTTPConnection(host)
  conn.request("POST", api, params, headers)
  response = conn.getresponse()
  return response 


# We make the request and parse the response
response_text = sendPost()
data = response_text.read()
r = json.loads(data)


# Show the response
print "Response"
print "================="
print data
print "\n"

# Prints the global sentiment values
print "Sentiment: "
print "==========="

try:
  if r['score'] != '':
    print 'Global sentiment: ' + r['score_tag'] +' (' + r['sd_tag'] + ')'
    print 'Subjectivity: ' + r['subjectivity']
    print 'Irony: ' + r['irony']
  else:
    print "Not found"
except KeyError:
  print "Not found"

try:
  if len(r['entity_list']) > 0:
    print "\nEntities"
    print "==========="
    entities = r['entity_list']
    for index in range(len(entities)):
      output = ''
      info = ''
      output += ' - ' + entities[index]['text']
      try:
        info += 'id: ' + entities[index]['id']
      except KeyError:
        pass
      try:
        if info != '':
          info += ','
        info += 'type: ' + entities[index]['type']
      except KeyError:
        pass
      if info != '':
        output += ' [' + info + ']'
      print output
except KeyError:
  pass
try:
  if len(r['concept_list']) > 0:
    print "\nConcepts"
    print "==========="
    concepts = r['concept_list']
    for index in range(len(concepts)):
      output = ''
      info = ''
      output += ' - ' + concepts[index]['text']
      try:
        info += 'id: ' + concepts[index]['id']
      except KeyError:
        pass
      try:
        if info != '':
          info += ','
        info += 'type: ' + concepts[index]['type']
      except KeyError:
        pass
      if info != '':
        output += ' [' + info + ']'
      print output
except KeyError:
  pass

print "\n"
