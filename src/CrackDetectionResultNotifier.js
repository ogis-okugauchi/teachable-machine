class CrackDetectionResultNotifier {

    constructor() {
        let params = queryString.parse(location.search.replace('?', ''));
        console.log('query params >>>', params);
        let host = params.apiHost || '127.0.0.1:10443';

        this.uri = `https://${host}/api/v1/resources/topics//sensorEvent/crackDetectionResult`;
        this.token = `Bearer ${params.token}`;
        this.method = 'POST';
        this.deviceId = params.CD || '999';
        this.enable = false;

        this.setSwitchCommunicationStatus('input-section');

        rx.fromEvent(window, 'classified').
            pipe(
                rxOps.throttleTime(1000),
                rxOps.map((event) => String(event.detail.classIndex))
            ).
            subscribe((classIndex) => {
                this.postRequest(classIndex).
                    subscribe((res) => console.log(res));
            });
    }


    setSwitchCommunicationStatus(elementID) {
        let clickableElement = document.getElementById(elementID);
        let viewElement = document.getElementById('machine');
        const activeClassName = 'communitaion-enabled';
        const inactiveClassName = 'communitaion-disabled';

        viewElement.classList.add(inactiveClassName);
        this.setEnable(false);

        clickableElement.addEventListener('click', (event) => {
            viewElement.classList.toggle(activeClassName);
            viewElement.classList.toggle(inactiveClassName);
            this.setEnable(viewElement.classList.contains(activeClassName));
        });
    }


    postRequest(classIndex) {
        return rx.iif(
            () => this.enable,
            rxAjax.ajax({
                url: this.uri,
                method: 'POST',
                headers: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json'
                },
                body: {
                    'deviceId': 'CD' + this.deviceId,
                    'detectionResult': classIndex,
                    'createdAt': new Date().toISOString()
                }
            }).pipe(
                rxOps.map((res) => res.xhr.response)
            ),
            rx.of('Communication is disabled by user on browsing.')
        );
    }


    setEnable(flag) {
        this.enable = flag;
        console.log(flag ? '[INFO] Communication: ON' : '[INFO] Communication: OFF');
    }
}


import *as rx from 'rxjs';
import *as rxAjax from 'rxjs/ajax';
import *as rxOps from 'rxjs/operators';

import *as queryString from 'querystring';

export default CrackDetectionResultNotifier;