import * as React from "react";
import { SuggestionsState } from "./interfaces";
import { Col, Row, Page } from "../ui/index";
import { SuggestionsForm } from "./components/suggestions_form";

export class Suggestions extends React.Component<Partial<SuggestionsState>> {
  state: SuggestionsState = { done: false};
	
  render() {
	const done = this.state.done;
    return <Page className="suggestions">
      <Row>
        <Col sm={12}>
			{!done &&  
				<SuggestionsForm />}
            {done 
			
            }
        </Col>
      </Row>
    </Page>;
  }
}
