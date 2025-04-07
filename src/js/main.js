	window.onload = async function() {
		const supabaseUrl = 'https://htbxgsolhsxacotnprjq.supabase.co'; // Replace with your Supabase URL
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Ynhnc29saHN4YWNvdG5wcmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzQ2MzAsImV4cCI6MjA1NzIxMDYzMH0.OJy9IdF8aWh_YuqU3WIdvuqAX-2GAfTTjMxu9zMAHMo'; // Replace with your Supabase Anon Key
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        
		console.log("Full pathname:", window.location.pathname);
		const pathParts = window.location.pathname.split('/').filter(Boolean);
		const username = pathParts[0] || "#no-user#";
		const project = pathParts[1] || "#no-project#";
		
		if(username!="#no-user#")
		{
			let logged=false;
				if(username == await getUsername()){
					logged=true;
				}
				else{
					logged=false;
				}
			if(project!="#no-project#")
			{
				const script = document.createElement('script');
				script.src = '/src/js/graph.js';
				script.onload = () => {
					if (typeof initializeGraph === 'function') {
						initializeGraph(username, project);
					}
				};
				document.head.appendChild(script);
			}
			else
			{
				if(logged)
				{
					const profileDiv = document.createElement("div");
					profileDiv.className = "profile";
					const heading = document.createElement("h1");
					heading.innerHTML = 'Welcome <span id="username">'+username+'</span>';
					profileDiv.appendChild(heading);
					document.body.appendChild(profileDiv);
				}
				else
				{						
					const profileDiv = document.createElement("div");
					profileDiv.className = "profile";
					const heading = document.createElement("h1");
					heading.innerHTML = 'Archive of <span id="username">'+username+'</span>';
					profileDiv.appendChild(heading);
					document.body.appendChild(profileDiv);
				}
				const Projects= await getProjects(username)
				Projects.forEach(project=>{
					const but=document.createElement("a");
					but.textContent=project.name;
					but.href="/"+username+"/"+project.name;
					but.classList.add("project-link");
					document.body.appendChild(but);
				});
			}	
		}
	}
		async function getProjects(username) {
			
		const supabaseUrl = 'https://htbxgsolhsxacotnprjq.supabase.co'; // Replace with your Supabase URL
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Ynhnc29saHN4YWNvdG5wcmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzQ2MzAsImV4cCI6MjA1NzIxMDYzMH0.OJy9IdF8aWh_YuqU3WIdvuqAX-2GAfTTjMxu9zMAHMo'; // Replace with your Supabase Anon Key
        const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
        
			const { data: userData, error: userError } = await supabaseClient
			.from('User')  
			.select('id')
			.eq('username', username)
			.single();
			
			if (userError || !userData) {
				console.error('Error fetching user ID:', userError);
				return null;
			}

			const userId = parseInt(userData.id, 10);
			
			const { data: treeData, error: treeError } = await supabaseClient
				.from('Tree')
				.select('name')
				.eq('user', userId);
				
			console.log("tree", treeData);
			
			return treeData;
		}
		async function getUsername() {
			const supabaseUrl = 'https://htbxgsolhsxacotnprjq.supabase.co'; // Replace with your Supabase URL
			const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Ynhnc29saHN4YWNvdG5wcmpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MzQ2MzAsImV4cCI6MjA1NzIxMDYzMH0.OJy9IdF8aWh_YuqU3WIdvuqAX-2GAfTTjMxu9zMAHMo'; // Replace with your Supabase Anon Key
			const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
		
		  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

		  if (userError) {
			console.error('Error getting user:', userError.message);
			return null;
		  }

		  if (!user) {
			console.log('No user logged in');
			return null;
		  }

		  const userId = user.id;
			
		  const { data, error } = await supabaseClient
			.from('User') // your public user table
			.select('username')
			.eq('user_id', userId) // match on auth uuid
			.single(); // Expecting exactly one match

		  if (error) {
			console.error('Error fetching username:', error.message);
			return null;
		  }

		  console.log('Username:', data.username);
		  return data.username;
		}
