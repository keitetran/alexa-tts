import requests

DOMAIN = 'alexa_tts'

ATTR_MSG = 'msg'
DEFAULT_MSG = 'Hello from Home Assistant.'


def setup(hass, config):
  """Set up is called when Home Assistant is loading our component."""

  def handle_init(call):
    msg = call.data.get(ATTR_MSG, DEFAULT_MSG)
    # hass.states.set('alexa_tts.msg', msg)
    requests.get('http://localhost:8125/tts/' + msg)

  hass.services.register(DOMAIN, 'msg', handle_init)
  
  return True # Return boolean to indicate that initialization was successfully. 