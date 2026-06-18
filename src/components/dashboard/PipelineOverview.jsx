/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier.
 * @property {string} company - Company name.
 * @property {string} contactName - Contact person.
 * @property {string} stage - Pipeline stage ('New' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost').
 * @property {string} value - Projected deal value.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - List of leads in the CRM.
 */

/**
 * PipelineOverview component renders a horizontal bar chart segmenting leads by their status stage,
 * accompanied by a detailed legend.
 * Uses Tailwind CSS v4 custom theme classes.
 *
 * @param {PipelineOverviewProps} props - Component props.
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
const PipelineOverview = ({ leads = [] }) => {
  const totalLeads = leads.length;

  // Define the stage configuration including display names, matching colors, and text classes
  const stageConfig = [
    { name: 'New', key: 'New', bgClass: 'bg-purple-500', textClass: 'text-purple-400', borderClass: 'border-purple-500/20' },
    { name: 'Contacted', key: 'Contacted', bgClass: 'bg-primary', textClass: 'text-blue-400', borderClass: 'border-blue-500/20' },
    { name: 'Proposal', key: 'Proposal', bgClass: 'bg-warning', textClass: 'text-warning', borderClass: 'border-warning/20' },
    { name: 'Negotiation', key: 'Negotiation', bgClass: 'bg-success', textClass: 'text-success', borderClass: 'border-success/20' },
    { name: 'Won', key: 'Won', bgClass: 'bg-cyan-500', textClass: 'text-cyan-400', borderClass: 'border-cyan-500/20' },
    { name: 'Lost', key: 'Lost', bgClass: 'bg-danger', textClass: 'text-danger', borderClass: 'border-danger/20' },
  ];

  // Calculate the occurrences and percentage representation of each stage
  const stageStats = stageConfig.map((stage) => {
    const count = leads.filter((lead) => lead.stage?.toLowerCase() === stage.key.toLowerCase()).length;
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    
    // Sum total pipeline value for this stage
    const valueSum = leads
      .filter((lead) => lead.stage?.toLowerCase() === stage.key.toLowerCase())
      .reduce((sum, lead) => {
        // Parse numerical value from string format e.g., "$38,200" or 38200
        const numericVal = typeof lead.value === 'string'
          ? parseFloat(lead.value.replace(/[^0-9.-]+/g, '')) || 0
          : parseFloat(lead.value) || 0;
        return sum + numericVal;
      }, 0);

    return {
      ...stage,
      count,
      percentage,
      valueSum,
    };
  });

  return (
    <div className="p-6 rounded-2xl bg-slate-900 light:bg-white border border-slate-800 light:border-slate-200 shadow-md flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <h4 className="text-base font-bold text-white light:text-black tracking-wide">Pipeline Overview</h4>
        <p className="text-xs text-slate-500 light:text-slate-400 mt-1">
          Visual distribution of active leads across sales process stages
        </p>
      </div>

      <div className="my-6">
        {totalLeads === 0 ? (
          <div className="flex items-center justify-center h-8 bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-200 rounded-lg text-slate-500 light:text-slate-400 text-xs font-medium">
            No pipeline leads recorded
          </div>
        ) : (
          <div className="relative">
            {/* Visual horizontal segmented progress bar */}
            <div className="h-4 w-full bg-slate-950 light:bg-slate-100 rounded-full flex overflow-hidden border border-slate-800 light:border-slate-200">
              {stageStats.map(
                (stage) =>
                  stage.count > 0 && (
                    <div
                      key={stage.key}
                      style={{ width: `${stage.percentage}%` }}
                      className={`h-full ${stage.bgClass} hover:opacity-90 transition-opacity cursor-pointer relative group`}
                      title={`${stage.name}: ${stage.count} leads (${Math.round(stage.percentage)}%)`}
                    />
                  )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Segment Legends and details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stageStats.map((stage) => {
          return (
            <div
              key={stage.key}
              className={`p-3 rounded-xl bg-slate-950/40 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-350 transition-colors flex flex-col justify-between`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stage.bgClass} shrink-0`} />
                <span className="text-xs font-semibold text-slate-300 light:text-black">{stage.name}</span>
              </div>
              <div className="mt-2">
                <p className="text-[10px] text-slate-500 light:text-slate-400 font-medium">
                  Leads: <strong className="text-slate-300 light:text-black">{stage.count}</strong>
                </p>
                <p className="text-[10px] text-slate-500 light:text-slate-400 font-medium">
                  Value:{' '}
                  <strong className="text-slate-300 light:text-black">
                    ${stage.valueSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </strong>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineOverview;
