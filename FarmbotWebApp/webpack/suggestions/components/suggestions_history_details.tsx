import * as React from "react";
import { WidgetBody, Widget, Col, Row } from "../../ui/index";


interface SuggestionsHistoryDetailsProps {
  id: number;
  dateDemande: string;
  fruits: boolean;
  legumes: boolean;
  saison: string;
  luminosite: string;
  changement: string;
  suggestions: SuggestionItem[];
}
	
interface SuggestionItem{
  id: number;
  plantId: string;
  plantSlug: string;
  quantity: boolean;
  becauseOf: boolean;
}
	
export class SuggestionsHistoryDetails extends React.Component<SuggestionsHistoryDetailsProps, {}> {   
  render() {
	const fruits = this.props.fruits.toString();
	const legumes = this.props.legumes.toString();
    return <Widget>
      <WidgetBody>
		  <Row>
			<Col xs={12}>
				{this.props.id > 0 && 
					<div>
						<p style={{textAlign : 'center'}}>
							<h4>Suggestion du {this.props.dateDemande}</h4>
						</p>
						<br/>
						<p>
							<h5>Vous avez demandé :</h5><br/>
							<br/>
							Des suggestions pour {this.props.saison == "any" ? "toutes saisons" : this.props.saison}<br/>
							
							Avec un éclairage {this.props.luminosite == "any" ? "quelconque" : this.props.luminosite}<br/>
							{this.props.fruits==true}
							{(fruits=="true" && legumes=="true") ? "Une envie de  fruits et de légumes" : null}
							{(fruits=="true" && legumes=="false") ? "Une envie de  fruits" : null}
							{(fruits=="false" && legumes=="true") ? "Une envie de  légumes" : null}
							{(fruits=="false" && legumes=="false") ? "Aucune envie particulière" : null}<br/>
							
							{this.props.changement == "oui" ? "De la nouveauté dans votre FarmBot" : null}
							{this.props.changement == "non" ? "De garder vos habitudes alimentaires" : null}<br/>
						</p>
						<br/>
						<br/>
						<p>
							<h5>Nous vous avons suggéré :</h5><br/>
							<br/>
							{this.props.suggestions.length > 0 && 
								<ul>
									{this.props.suggestions.map(item => <ListItem 
																		id={item.id} 
																		plantId={item.plantId}
																		plantSlug={item.plantSlug}
																		quantity={item.quantity}
																		becauseOf={item.becauseOf}/>)}
								</ul>
							}
							{this.props.suggestions.length == 0 && 
									<div>
										Aucune suggestion !..
									</div>
							}
						</p>
					</div>
				}
				{this.props.id<0 && 
					<div>
						Aucune demande sélectionnée.
					</div>
				}
			</Col>
		  </Row>
      </WidgetBody>
    </Widget>;
  }
}

class ListItem extends React.Component<SuggestionItem, {}>{
	render(){
		return <li>
				<Row>
					<Col xs={12}>
						{this.props.quantity}x {this.props.plantSlug}
					</Col>
				</Row>
			</li>
	}
}
