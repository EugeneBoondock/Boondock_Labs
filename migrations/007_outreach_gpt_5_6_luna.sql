UPDATE outreach_agents
SET model = 'gpt-5.6-luna'
WHERE id IN ('lead-research', 'outreach', 'reply-quotation')
  AND model = 'gpt-6-luna';
