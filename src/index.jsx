import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext, useState } from '@forge/ui';
import api, { route } from "@forge/api";

const App = () => {
	const context = useProductContext();
	const [comments] = useState(async () => await fetchCommentsForIssue(context.platformContext.issueKey));
	const [changes] = useState(async () => await fetchChangelogForIssue(context.platformContext.issueKey));
	
//	console.log(`Number of comments on this issue: ${comments.length}`);

  	return (
	    <Fragment>
	    	<Fragment>
		      <Text>
		        Number of comments on this issue: {comments.length}
		      </Text>
			   
		    </Fragment>
	      	<Fragment>
		      <Text>
		      	Changes done since issue creation: {changes.length}
		      </Text>
		    <Fragment>
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