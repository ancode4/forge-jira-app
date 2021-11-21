import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState
, Strong, User, Em, Table, Head, Cell, Row } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
	const context = useProductContext();
	const [comments] = useState(async () => await fetchCommentsForIssue(context.platformContext.issueKey));
	const [changes] = useState(async () => await fetchChangelogForIssue(context.platformContext.issueKey));
	let lastComment = null;
	if(comments.length > 0) {
		lastComment = comments[comments.length-1]
	}
	let chItems = [];
	for(let i=0;i<changes.length;i++){
		let item = changes[i].items[0]
		chItems.push(<Row>
			        <Cell>
			          <Text>{item.field}</Text>
			        </Cell>
			        <Cell>
			          <Text>{item.fromString}</Text>
			        </Cell>
			        <Cell>
			          <Text>{item['toString']}</Text>
			        </Cell>
			      </Row>
			      )
		//console.log(changes[i].items);
	}

  	return (
	    <Fragment>
		      <Text>
		        <Strong>Number of comments:</Strong> {comments.length}
		      </Text>
		      {lastComment !== null ?

		      	<Text>Last commented by <Strong>{lastComment.author.displayName}</Strong>: 
		      		<Em> "{lastComment.body.content[0].content[0].text}"</Em>
		      	</Text>
		      	: null
		      }
		      <Text>
		      	<Strong>Changes done since issue creation:</Strong> {changes.length}
		      </Text>
		      <Table>
			    <Head>
			      <Cell>
			        <Text>Field changed</Text>
			      </Cell>
			      <Cell>
			        <Text>From</Text>
			      </Cell>
			      <Cell>
			        <Text>To</Text>
			      </Cell>
			    </Head>
			    {chItems}
			  </Table>
	    </Fragment>
	);
};

export const run = render(
	<IssuePanel>
	    <App />
	</IssuePanel>
);

const fetchCommentsForIssue = async (issueId) => {
  	const data = await jiraAPIRequest(route`/rest/api/3/issue/${issueId}/comment`);
  	return data.comments;
};

const fetchChangelogForIssue = async (issueId) => {
  	const data = await jiraAPIRequest(route`/rest/api/3/issue/${issueId}/changelog`);
  	return data.values;
}

const jiraAPIRequest = async (url) => {
	const res = await api.asUser().requestJira(url);
  	return await res.json();
}