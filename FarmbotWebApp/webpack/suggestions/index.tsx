import * as React from "react";
import { SuggestionsState } from "./interfaces";
import { Col, Row, Page } from "../ui/index";
import { SuggestionsForm } from "./components/suggestions_form";
import { SuggestionsHistory } from "./components/suggestions_history";
import { t } from "i18next";

export class Suggestions extends React.Component<Partial<SuggestionsState>> {
  state: SuggestionsState = { form: true };
  userId: number = this.getUserId();
	
  toggle = (name: keyof SuggestionsState) =>
    () => {this.setState({ [name]: !this.state[name] });}	
    
  getUserId(){
	var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:3000/api/users",false);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoyMTAsImlhdCI6MTUyNzUxNTg0NCwianRpIjoiYTJjYTA2NjItZjUwZC00ZjI4LWEyNTMtODNlY2JiNWVjY2RjIiwiaXNzIjoiLy8xMC4wLjIuMTU6MzAwMCIsImV4cCI6MTUzMDk3MTg0NCwibXF0dCI6IjAuMC4wLjAiLCJib3QiOiJkZXZpY2VfMjgzIiwidmhvc3QiOiIvIiwibXF0dF93cyI6IndzOi8vMC4wLjAuMDozMDAyL3dzIiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImludGVyaW1fZW1haWwiOiJqZWdvOTk5QGhvdG1haWwuZnIiLCJmd191cGRhdGVfc2VydmVyIjoiREVQUkVDQVRFRCIsImJldGFfb3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCJ9.ZbonJF4FA1z6AL5C8FbmZN9UON6w4AwmsjMtN9s4iriUqs7vPcOINM27hA2WQoHvlpcGj_PTgmZbjje861KqCe_yEBHz8sMi12fmzV5t1KAUBH4OzGPATtcekfh1wFM2Rw_3vX-p2iUp6c7-oS1sAcG1BENNHsImZZVzToHpnhSK1tZt5AfuHcaxIgxNmi8E3Sk8KgHIFMeLgFx9EN43xfqigjXc8KjJ4SAMnOARI9cm4BL6aJNtCEn49k7U0Hbqh6IjoZs9jb3wx_ntg1oRITWAiQDLoo-Z9O8y3rdYeMqExcdDrUTfxxtV3dhRVKqngQKWtDw_xTKL3tFhfFu7BQ");
    
    req.send(null);
    
    let response = JSON.parse(req.response);
    let userId = response[0].id;
    
    return userId;
  }
	
  render() {
    let text = "";
    if(this.state.form){
		text = "Historique";
	}else{
		text = "Formulaire";
	}
    return <Page className="suggestions">
	  <Row>
        <Col sm={12}>
			<button
				onClick={this.toggle("form")}
				className="fb-button green pull-right">
				{t(text)}
			  </button>
        </Col>
      </Row>
      
      <Row>
        <Col sm={12}>
			{this.state.form &&  
				<SuggestionsForm 
					doneAction={this.toggle("form")}
					userId={this.userId} />}
            {!this.state.form &&  
				<SuggestionsHistory
					userId={this.userId} 
					currentList={-1} />}
        </Col>
      </Row>
    </Page>;
  }
}
