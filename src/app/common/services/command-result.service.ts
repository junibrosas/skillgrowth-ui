import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class CommandResultService {
    savedText = 'Changes has been saved.';
    deletedText = 'Deleted successfully.';
    errorText = 'Something is wrong.';

    constructor(
        private toastr: ToastrService
    ) { }

    promptSaved(message?: string) {
        if (!message) {
            message = this.savedText;
        }
        this.logger(message);
        this.toastr.success(message);
    }

    promptDeleted(message?: string) {
        if (!message) {
            message = this.deletedText;
        }
        this.logger(message);
        this.toastr.success(message);
    }

    /**
     * Show error message from specified message.
     * @param message specified error message
     */
    promptError(message?: string) {
        if (!message) {
            message = this.errorText;
        }
        this.logger(message);
        this.toastr.error(message, 'Opps!');
    }


    /**
     * Show success message from specified message.
     * @param message specified success message
     */
    success(message: string) {
        this.logger(message);
        this.toastr.success(message);
    }

    /**
     * Show error message from subscribed observable.
     * @param response an http error response
     */
    error(response: HttpErrorResponse) {
        this.logger(JSON.stringify(response));
        this.toastr.error(response.error, 'Opps!');
    }

    private logger(message: string) {
        console.log(`LOG RESULT: ${message}`);
    }
}
