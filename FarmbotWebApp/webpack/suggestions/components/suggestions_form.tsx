import * as React from "react";
import { WidgetBody, Widget, Col, Row } from "../../ui/index";
import { t } from "i18next";

export interface State {
  saison?: string;
  test?: string;
}

export interface Props { }

export class SuggestionsForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
	  saison: "",
	  test: ""
    };
  }
    
  submit(e: React.SyntheticEvent<HTMLInputElement>) {
    e.preventDefault();
    console.log(this.state);
  }
  
  set = (name: string) => (event: React.FormEvent<HTMLInputElement>) => {
    const state: { [name: string]: string } = {};
    state[name] = (event.currentTarget).value;
    this.setState(state);
  }
  
  render() {
    return <Widget>
      <WidgetBody>
        <form onSubmit={this.submit.bind(this)}>
		  <label>
			{t("Saison")}
		  </label>
			<select onChange={this.set("saison").bind(this)}>
				<option value="Toutes">Toutes</option>
				<option value="Automne">Automne</option>
				<option value="Hiver">Hiver</option>
				<option value="Printemps">Printemps</option>
				<option value="Eté">Eté</option>
			</select>
		  <label>
			{t("Paramètre...")}
		  </label>
		    <input type="text" onChange={this.set("test").bind(this)}/>
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
