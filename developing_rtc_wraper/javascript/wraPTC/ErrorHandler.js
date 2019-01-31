'use strict'

class ErrorHandler {

    static handleLocalMediaStreamError(error) {
        trace(`navigator.getUserMedia error: ${error.toString()}.`);
      }

}