import { Injectable } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateAdapter {
    fromModel(value: string): NgbDateStruct | null {
        if (!value)
            return null
        let parts = value.split('-');
        return { year: +parts[0], month: +parts[1], day: +parts[2] }
    }

    toModel(date: NgbDateStruct): string | null // from internal model -> your mode
    {
        console.log(1, date)
        // return date ?('0' + date.month).slice(-2)
        //     + "-" + ('0' + date.day).slice(-2) 
        //     + "-" +  date.year  : null


            return date ?('0' + date.year).slice(-2)
            + "-" + ('0' + date.month).slice(-2) 
            + "-" +  date.day  : null
    }
}