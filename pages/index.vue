<template>
	<div>
		<article
			v-if="status==='pending'"
			aria-busy="true"
		/>
		<article
			v-else-if="error"
			class="error"
		>
			{{ error.statusMessage }}
		</article>
		<div v-else>
			<div v-if="tasks.length>0">
				<article
					v-for="task in tasks"
					:key="task.id"
				>
					{{ task.title }}
					<div class="button-container">
						<NuxtLink
							role="button"
							:to="{ name: 'tasks-id', params: { id: task.id } }"
						>
							View
						</NuxtLink>
					</div>
				</article>
			</div>
			<div v-else>
				No Tasks Added
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { data: tasks, error, status } = useFetch("/api/tasks", { lazy: true });
</script>
