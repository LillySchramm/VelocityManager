import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as qr from 'qrcode';
import { take } from 'rxjs/operators';
import { unloadTOTP } from 'src/app/store/auth/auth.actions';
import { selectTOTP } from 'src/app/store/auth/auth.selectors';

@Component({
    selector: 'app-totp',
    templateUrl: './totp.component.html',
    styleUrls: ['./totp.component.scss'],
})
export class TotpComponent implements OnInit {
    public dataUrl = '';

    constructor(private store: Store) {}

    async ngOnInit(): Promise<void> {
        this.store
            .select(selectTOTP)
            .pipe(take(1))
            .subscribe(async (totp) => {
                if (!totp) {
                    return;
                }

                this.dataUrl = await qr.toDataURL(totp, {
                    errorCorrectionLevel: 'L',
                    margin: 1,
                    type: 'image/jpeg',
                    rendererOpts: { quality: 1 },
                });

                this.store.dispatch(unloadTOTP());
            });
    }
}
