import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState
, Strong, User, Em } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
	const context = useProductContext();
	const [comments] = useState(async () => await fetchCommentsForIssue(context.platformContext.issueKey));
	const [changes] = useState(async () => await fetchChangelogForIssue(context.platformContext.issueKey));
	let lastComment = null;
	if(comments.length > 0) {
		lastComment = comments[comments.length-1]
	}
//	console.log(`Number of comments on this issue: ${comments.length}`);

  	return (
	    <Fragment>
		      <Text>
		        <Strong>Number of comments:</Strong> {comments.length}
		      </Text>
		      {lastComment !== null ?

		      	<Text>Last commented by {lastComment.author.displayName}:
		      		<Em>"{lastComment.body.content[0].content[0].text}"</Em>
		      	</Text>
		      	: null
		      }
		      <Text>
		      	Changes done since issue creation: {changes.length}
		      </Text>
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