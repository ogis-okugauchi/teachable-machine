/* eslint-disable max-params */
class CrackDetectionResultNotifier {
  constructor(id, method, uri, token) {
    let apiHost = '127.0.0.1:10443';
    // let apiHost = 'dev.vantiq.com';
    this.uri = uri || `https://${apiHost}/api/v1/resources/custom/T_CrackDetectionEvent`;
    this.token = `Bearer ${token}`;
    this.method = method || 'POST';
    this.deviceId = id || v1();
    this.enable = true;

    rx.fromEvent(window, 'classified').
      pipe(
        // rxOps.tap((content) => console.log(content)),
        rxOps.throttleTime(1000)
      ).
      subscribe((classified) => {
        let msg = JSON.stringify({
          'deviceId': this.deviceId,
          'detectionResult': String(classified.detail.classIndex),
          'createdAt': new Date().toISOString()
        });

        let request = new XMLHttpRequest();
        request.open(this.method, this.uri);
    
        request.setRequestHeader('Authorization', this.token);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(msg);

        request.onreadystatechange = function() {
          if (this.status === 200 && this.readyState === 4) {
            console.log('responce >>>', JSON.parse(request.responseText));
          }
        };
      });
  }

  setEnable(flag) {
    this.enable = flag;
  }
}

import v1 from 'uuid/v1';
import *as rx from 'rxjs';
import *as rxOps from 'rxjs/operators';

export default CrackDetectionResultNotifier;