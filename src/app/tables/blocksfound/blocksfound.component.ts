import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { ExampleDatabase, ExampleDataSource } from './helpers.data';
import {httpdataservice} from '../../services/http-request.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fixed-table',
  templateUrl: './blocksfound.component.html',
  styleUrls: ['./blocksfound.component.scss']
})
export class blocksfoundComponent implements OnInit {
	public dashCard = [
        { colorDark: '#fa741c', colorLight: '#fb934e', number: 0, settings: true, title: 'BLOCKS FOUND', icon: 'assignments' },
        { colorDark: '#fa741c', colorLight: '#fb934e', number: 0, settings: true, title: 'AVERAGE', icon: 'done' }
    ];
	total_blocks_found:any = 0;
	total_average:number = 0;
	public displayedColumns = ['ID', 'block_height', 'block_hash', 'block_date_and_time', 'block_reward'];
	public exampleDatabase = new ExampleDatabase();
	public dataSource: ExampleDataSource | null;
  	public showFilterTableCode;
  	constructor(private httpdataservice: httpdataservice) { }

  	ngOnInit() {
          // get the data
          this.httpdataservice.get_request(this.httpdataservice.SERVER_HOSTNAME_AND_PORT_GET_BLOCKS_FOUND).subscribe(
	  (res) =>
	  {            
            this.exampleDatabase = new ExampleDatabase();
            var data = JSON.parse(JSON.stringify(res));
	    var count = 0;
            var block_reward;
            this.total_blocks_found = data.length;
	    for (count = 0; count < data.length; count++)
	    {
              block_reward = parseInt(data[count].block_reward) / this.httpdataservice.XCASH_WALLET_DECIMAL_PLACES_AMOUNT;
	      this.exampleDatabase.addUser((count + 1).toString(),data[count].block_height.toString(),data[count].block_hash.toString(),(parseInt(data[count].block_date_and_time) * 1000).toString(),block_reward.toString());
	    }
	    this.dashCard[0].number = data.length;
  	    this.dataSource = new ExampleDataSource(this.exampleDatabase);

            this.httpdataservice.get_request(this.httpdataservice.SERVER_HOSTNAME_AND_PORT_GET_STATISTICS).subscribe(
	  (res) =>
	  {            
            var data = JSON.parse(JSON.stringify(res)); 
            this.total_average = ((parseInt(data.block_verifier_total_rounds)/(100*this.total_blocks_found))*100) | 0;
	    this.dashCard[0].number = data.length;
            this.dashCard[1].number = this.total_average;
  	    this.dataSource = new ExampleDataSource(this.exampleDatabase);
	  },
	  (error) => 
          {
	    Swal.fire("Error","An error has occured","error");
	  }
	  );
	  },
	  (error) => 
          {
	    Swal.fire("Error","An error has occured","error");
	  }
	  );
    }
}
