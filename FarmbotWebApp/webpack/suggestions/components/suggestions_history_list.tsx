import * as React from "react";
import { WidgetBody, Widget, Col, Row } from "../../ui/index";


interface SuggestionsHistoryListProps {
  userId: number;
  changeList(id:number, date:string, fruits:boolean, legumes:boolean, saison:string, luminosite:string, changement:string): void;
}

interface ListItemProps {
  id: number;
  changeList(id:number, dateDemande:string, fruits:boolean, legumes:boolean, saison:string, luminosite:string, changement:string): void;
  dateDemande: string;
  fruits: boolean;
  legumes: boolean;
  changement: string;
  saison: string;
  luminosite: string;
}

interface ListItem{
  id: number;
  userId: string;
  dateDemande: string;
  fruits: boolean;
  legumes: boolean;
  saison: string;
  luminosite: string;
  changement: string;
}
	
export class SuggestionsHistoryList extends React.Component<SuggestionsHistoryListProps, {}> {  
  lists: ListItem[] = this.getHistoryList();
  
  getHistoryList(){
	var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/api/list_suggestion_byuser/"+this.props.userId,false);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoyMTAsImlhdCI6MTUyNzUxNTg0NCwianRpIjoiYTJjYTA2NjItZjUwZC00ZjI4LWEyNTMtODNlY2JiNWVjY2RjIiwiaXNzIjoiLy8xMC4wLjIuMTU6MzAwMCIsImV4cCI6MTUzMDk3MTg0NCwibXF0dCI6IjAuMC4wLjAiLCJib3QiOiJkZXZpY2VfMjgzIiwidmhvc3QiOiIvIiwibXF0dF93cyI6IndzOi8vMC4wLjAuMDozMDAyL3dzIiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImludGVyaW1fZW1haWwiOiJqZWdvOTk5QGhvdG1haWwuZnIiLCJmd191cGRhdGVfc2VydmVyIjoiREVQUkVDQVRFRCIsImJldGFfb3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCJ9.ZbonJF4FA1z6AL5C8FbmZN9UON6w4AwmsjMtN9s4iriUqs7vPcOINM27hA2WQoHvlpcGj_PTgmZbjje861KqCe_yEBHz8sMi12fmzV5t1KAUBH4OzGPATtcekfh1wFM2Rw_3vX-p2iUp6c7-oS1sAcG1BENNHsImZZVzToHpnhSK1tZt5AfuHcaxIgxNmi8E3Sk8KgHIFMeLgFx9EN43xfqigjXc8KjJ4SAMnOARI9cm4BL6aJNtCEn49k7U0Hbqh6IjoZs9jb3wx_ntg1oRITWAiQDLoo-Z9O8y3rdYeMqExcdDrUTfxxtV3dhRVKqngQKWtDw_xTKL3tFhfFu7BQ");
    
    req.send(null);
    
    let response = JSON.parse(req.response);
    return response["entries"];
  }

  render() {
    return <Widget>
      <WidgetBody>
		  <Row>
			<Col xs={12}>
				{this.lists.length > 0 && 
					<ul>
						{this.lists.map(item => <ListItem 
													id={item.id} 
													changeList={this.props.changeList}
													dateDemande={item.dateDemande}
													saison={item.saison}
													changement={item.changement}
													fruits={item.fruits}
													legumes={item.legumes}
													luminosite={item.luminosite}/>)}
					</ul>
				}
				{this.lists.length == 0 && 
					<div>
						Aucune demande pour le moment !
					</div>
				}
			</Col>
		  </Row>
      </WidgetBody>
    </Widget>;
  }
}

class ListItem extends React.Component<ListItemProps, {}>{
	render(){
		return <li style={{margin : '10px'}}>
				<Row>
					<Col xs={8}>
						Demande du {this.props.dateDemande}
					</Col>
					<Col xs={4}>
						<button
							onClick={() => { this.props.changeList(this.props.id,this.props.dateDemande,this.props.fruits,this.props.legumes,this.props.saison,this.props.luminosite,this.props.changement)}}
							className="fb-button green pull-right">
							Voir
						  </button>
					</Col>
				</Row>
			</li>
	}
}
