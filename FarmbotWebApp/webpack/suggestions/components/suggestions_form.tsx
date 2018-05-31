import * as React from "react";
import { WidgetBody, Widget, Col, Row } from "../../ui/index";
import { t } from "i18next";

interface SuggestionsFormProps {
  doneAction(): void;
  userId: number;
}

interface State {
  [key:string]: any;
  saison?: string;
  eclairage?: string;
  changement?: string;
  fruits?: boolean;
  légumes?: boolean;
}
	
export class SuggestionsForm extends React.Component<SuggestionsFormProps, {}> {
  state: State = {
	  saison: "any",
	  eclairage: "any",
	  changement: "any",
	  fruits: false,
	  légumes: false
  };
    
  submit(e: React.SyntheticEvent<HTMLInputElement>) {
    e.preventDefault();
    console.log(this.state);
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:3000/api/list_suggestions");
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoyMTAsImlhdCI6MTUyNzUxNTg0NCwianRpIjoiYTJjYTA2NjItZjUwZC00ZjI4LWEyNTMtODNlY2JiNWVjY2RjIiwiaXNzIjoiLy8xMC4wLjIuMTU6MzAwMCIsImV4cCI6MTUzMDk3MTg0NCwibXF0dCI6IjAuMC4wLjAiLCJib3QiOiJkZXZpY2VfMjgzIiwidmhvc3QiOiIvIiwibXF0dF93cyI6IndzOi8vMC4wLjAuMDozMDAyL3dzIiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImludGVyaW1fZW1haWwiOiJqZWdvOTk5QGhvdG1haWwuZnIiLCJmd191cGRhdGVfc2VydmVyIjoiREVQUkVDQVRFRCIsImJldGFfb3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCJ9.ZbonJF4FA1z6AL5C8FbmZN9UON6w4AwmsjMtN9s4iriUqs7vPcOINM27hA2WQoHvlpcGj_PTgmZbjje861KqCe_yEBHz8sMi12fmzV5t1KAUBH4OzGPATtcekfh1wFM2Rw_3vX-p2iUp6c7-oS1sAcG1BENNHsImZZVzToHpnhSK1tZt5AfuHcaxIgxNmi8E3Sk8KgHIFMeLgFx9EN43xfqigjXc8KjJ4SAMnOARI9cm4BL6aJNtCEn49k7U0Hbqh6IjoZs9jb3wx_ntg1oRITWAiQDLoo-Z9O8y3rdYeMqExcdDrUTfxxtV3dhRVKqngQKWtDw_xTKL3tFhfFu7BQ");
    
    let json: string = '{"userId":"'+this.props.userId+'","saison":"'+this.state.saison+'", "luminosite":"'+this.state.eclairage+'", "fruits":"'+this.state.fruits+'", "legumes":"'+this.state.légumes+'", "changement":"'+this.state.changement+'"}';
    req.send(json);
    
    this.props.doneAction();
  }
  
  set = (name: string) => (event: React.FormEvent<HTMLInputElement>) => {
    const state: { [name: string]: string } = {};
    state[name] = (event.currentTarget).value;
    this.setState(state);
  }
  
  toggle = (name: string) => (event: React.FormEvent<HTMLInputElement>) =>{
	event;
	const state: { [name: string]: any } = {};
	state[name] = !this.state[name];
	this.setState(state);
  } 
  
  render() {
    const inputStyle={width : 'auto'};
    return <Widget>
      <WidgetBody>
        <form onSubmit={this.submit.bind(this)}>
		  <Row>
		    <Col xs={6}>
			  <label>
				{t("Saison")}
			  </label>
				<select onChange={this.set("saison").bind(this)}>
					<option value="any">Peu importe</option>
					<option value="Automne">Automne</option>
					<option value="Hiver">Hiver</option>
					<option value="Printemps">Printemps</option>
					<option value="Eté">Eté</option>
				</select>
			</Col>
			<Col xs={6}>
			  <label>
				{t("Eclairage")}
			  </label>
				<select onChange={this.set("eclairage").bind(this)}>
					<option value="any">Peu importe</option>
					<option value="Fort">Fort</option>
					<option value="Modéré">Modéré</option>
					<option value="Faible">Faible</option>
				</select>
			</Col>
		  </Row>
		  <Row>
			<Col xs={6}>
			  <label>
				{t("Envie de changement ?")}<br/>
			  </label>
			  <Row>
				<Col xs={4}>
					<input style={inputStyle} type="radio" name="changement" value="any" checked={this.state.changement == "any"} onChange={this.set("changement").bind(this)} /> Peu importe
				</Col>
				<Col xs={4}>
					<input style={inputStyle} type="radio" name="changement" value="oui" onChange={this.set("changement").bind(this)} /> Oui !
				</Col>
				<Col xs={4}>	
					<input style={inputStyle} type="radio" name="changement" value="non" onChange={this.set("changement").bind(this)} /> Non
				</Col>
			  </Row>
			</Col>
			<Col xs={6}>
			  <label>
				{t("Plutôt envie de ...")}<br/>
			  </label>
			  <Row>
				<Col xs={6}>
					<input style={inputStyle} type="checkbox" onClick={this.toggle("fruits").bind(this)}/> Fruits
				</Col>
				<Col xs={6}>
					<input style={inputStyle} type="checkbox" onClick={this.toggle("légumes").bind(this)}/> Légumes
				</Col>
			  </Row>
			</Col>
		  </Row>
		  <Row>
			<Col xs={12}>
			  <button
				className="fb-button green pull-right">
				{t("Envoyer")}
			  </button>
			</Col>
		  </Row>
        </form>
      </WidgetBody>
    </Widget>;
  }
}
