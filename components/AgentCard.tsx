'use client'

interface Agent {
  id: number
  name: string
  role: string
  photo_url: string
  total_sold: number
  total_clients: number
}

interface AgentCardProps {
  agent: Agent
  onContact: (agentId: number) => void
}

export default function AgentCard({ agent, onContact }: AgentCardProps) {
  return (
    <div className="agent-card">
      <div className="agent-photo">
        <img src={agent.photo_url} alt={agent.name} />
      </div>
      <div className="agent-name">{agent.name}</div>
      <div className="agent-role">{agent.role}</div>
      <div className="agent-stats">
        <div className="agent-stat"><strong>{agent.total_sold}</strong><span>Sales</span></div>
        <div className="agent-stat"><strong>{agent.total_clients}</strong><span>Clients</span></div>
      </div>
      <button className="agent-contact" onClick={() => onContact(agent.id)}>
        Contact {agent.name.split(' ')[0]}
      </button>
    </div>
  )
}
