import * as React from "react";
import { WidgetBody, Widget, Col, Row } from "../../ui/index";
import { SuggestionsHistoryDetails } from "./suggestions_history_details";
import { SuggestionsHistoryList } from "./suggestions_history_list";

interface SuggestionsHistoryProps {
  userId: number;
  currentList: number;
}

interface State {
  id: number;
  dateDemande: string;
  fruits: boolean;
  legumes: boolean;
  changement: string;
  saison: string;
  luminosite: string;
  suggestions: SuggestionItem[];
}

interface SuggestionItem{
  id: number;
  plantId: string;
  plantSlug: string;
  quantity: boolean;
  becauseOf: boolean;
}
	
export class SuggestionsHistory extends React.Component<SuggestionsHistoryProps, {}> { 
  state: State = {
	  id: this.props.currentList,
	  dateDemande: "",
	  fruits: false,
	  legumes: false,
	  saison: "",
	  luminosite: "",
	  changement: "",
	  suggestions: []
  };
  
  changeList(id:number, dateDemande:string, fruits:boolean, legumes:boolean, saison:string, luminosite:string, changement:string){
	this.setState({ ["id"]: id });
	this.setState({ ["dateDemande"]: dateDemande });
	this.setState({ ["fruits"]: fruits });
	this.setState({ ["legumes"]: legumes });
	this.setState({ ["saison"]: saison });
	this.setState({ ["luminosite"]: luminosite });
	this.setState({ ["changement"]: changement });
	
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:3000/api/suggestion_bylist/"+id,false);
	req.setRequestHeader("Content-Type", "application/json");
	req.setRequestHeader("Authorization", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoyMTAsImlhdCI6MTUyNzUxNTg0NCwianRpIjoiYTJjYTA2NjItZjUwZC00ZjI4LWEyNTMtODNlY2JiNWVjY2RjIiwiaXNzIjoiLy8xMC4wLjIuMTU6MzAwMCIsImV4cCI6MTUzMDk3MTg0NCwibXF0dCI6IjAuMC4wLjAiLCJib3QiOiJkZXZpY2VfMjgzIiwidmhvc3QiOiIvIiwibXF0dF93cyI6IndzOi8vMC4wLjAuMDozMDAyL3dzIiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImludGVyaW1fZW1haWwiOiJqZWdvOTk5QGhvdG1haWwuZnIiLCJmd191cGRhdGVfc2VydmVyIjoiREVQUkVDQVRFRCIsImJldGFfb3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCJ9.ZbonJF4FA1z6AL5C8FbmZN9UON6w4AwmsjMtN9s4iriUqs7vPcOINM27hA2WQoHvlpcGj_PTgmZbjje861KqCe_yEBHz8sMi12fmzV5t1KAUBH4OzGPATtcekfh1wFM2Rw_3vX-p2iUp6c7-oS1sAcG1BENNHsImZZVzToHpnhSK1tZt5AfuHcaxIgxNmi8E3Sk8KgHIFMeLgFx9EN43xfqigjXc8KjJ4SAMnOARI9cm4BL6aJNtCEn49k7U0Hbqh6IjoZs9jb3wx_ntg1oRITWAiQDLoo-Z9O8y3rdYeMqExcdDrUTfxxtV3dhRVKqngQKWtDw_xTKL3tFhfFu7BQ");
	
	req.send(null);
	
	let response = JSON.parse(req.response);
	let lists = response["entries"];
	console.log(req.response);
	this.setState({ ["suggestions"]: lists });
  }
  

  render() {
    return <Widget>
      <WidgetBody>
		  <Row>
			<Col xs={4}>
				<SuggestionsHistoryList
					userId={this.props.userId} 
					changeList={this.changeList.bind(this)}/>
			</Col>
			<Col xs={8}>
				<SuggestionsHistoryDetails
					id={this.state.id}
					dateDemande={this.state.dateDemande}
					saison={this.state.saison}
					changement={this.state.changement}
					fruits={this.state.fruits}
					legumes={this.state.legumes}
					luminosite={this.state.luminosite}
					suggestions={this.state.suggestions}/>
			</Col>
		  </Row>
      </WidgetBody>
    </Widget>;
  }
}
