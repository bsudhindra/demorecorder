import { useState, useMemo } from "react";

const PRODUCT_COLORS = {
  "Cashflow Lending": "bg-blue-100 text-blue-800",
  "ABL": "bg-purple-100 text-purple-800",
  "Supply Chain Finance": "bg-emerald-100 text-emerald-800",
  "Equipment Finance": "bg-orange-100 text-orange-800",
  "Syndicated Lending": "bg-teal-100 text-teal-800"
};

const PATTERN_COLORS = {
  "DataEnvelope": "bg-blue-100 text-blue-700",
  "Preamble-first UX": "bg-sky-100 text-sky-700",
  "Inline AI Sparkle": "bg-cyan-100 text-cyan-700",
  "NBP Chips": "bg-green-100 text-green-700",
  "Next-best-action Card": "bg-lime-100 text-lime-800",
  "Fire-and-forget": "bg-teal-100 text-teal-700",
  "Exception Desk": "bg-amber-100 text-amber-700",
  "Standing Deliverables": "bg-yellow-100 text-yellow-800",
  "Ambient Proactive": "bg-orange-100 text-orange-700",
  "Treasury Playbooks": "bg-red-100 text-red-700",
  "Cross-screen Continuity": "bg-violet-100 text-violet-700",
  "Explain-this-screen": "bg-purple-100 text-purple-700",
  "Inline Citation": "bg-slate-100 text-slate-600",
  "Two-Sided Endpoint": "bg-gray-200 text-gray-700",
  "Agent Activity Feed": "bg-zinc-100 text-zinc-600"
};

const PATTERN_CATEGORIES = {
  "Presentation": ["DataEnvelope", "Preamble-first UX", "Inline AI Sparkle"],
  "Interaction": ["NBP Chips", "Next-best-action Card", "Fire-and-forget"],
  "Proactive": ["Exception Desk", "Standing Deliverables", "Ambient Proactive", "Treasury Playbooks"],
  "Context": ["Cross-screen Continuity", "Explain-this-screen"],
  "Trust & Infra": ["Inline Citation", "Two-Sided Endpoint", "Agent Activity Feed"]
};

const features = [
  { product: "Cashflow Lending", category: "Visibility", name: "Facility Headroom Snapshot",
    what: "Ask how much is available on the revolver — committed, drawn, and undrawn amounts narrated in one answer.",
    patterns: ["DataEnvelope", "Preamble-first UX", "Inline AI Sparkle", "NBP Chips"],
    source: "Facility commitment & availability; Outstanding balances" },

  { product: "Cashflow Lending", category: "Drawdown & Repayment", name: "Drawdown Request Initiation",
    what: "Start a drawdown conversationally — amount, currency, interest period — with the assistant validating availability before handing off to Loan Portal.",
    patterns: ["Next-best-action Card", "Fire-and-forget", "Agent Activity Feed"],
    source: "Facility availability; Outstanding (new drawing)" },

  { product: "Cashflow Lending", category: "Drawdown & Repayment", name: "Rollover / Interest-Period Election",
    what: "Be reminded a maturing drawing needs rollover and select a new interest period via guided prompt chips.",
    patterns: ["Exception Desk", "Standing Deliverables", "NBP Chips", "Next-best-action Card"],
    source: "Outstanding maturity dates; interest pricing rules; rate calendar" },

  { product: "Cashflow Lending", category: "Alerts", name: "Rate-Reset Notification",
    what: "Receive advance notice of upcoming SOFR rate resets and the expected all-in rate for the next period.",
    patterns: ["Ambient Proactive", "Standing Deliverables"],
    source: "Interest pricing rules; rate-setting calendar; Outstanding accruals" },

  { product: "Cashflow Lending", category: "Covenant Management", name: "Covenant Deadline & Headroom Alert",
    what: "Get reminders that a quarterly compliance certificate is due and see leverage/coverage headroom vs. threshold.",
    patterns: ["Exception Desk", "Ambient Proactive", "Treasury Playbooks", "Standing Deliverables"],
    source: "Covenant schedule; financial covenant definitions" },

  { product: "Cashflow Lending", category: "Analytics", name: "Interest & Fee Cost Forecast",
    what: "Ask what the facility will cost next quarter — projected interest plus commitment fees on undrawn amounts, narrated from a deterministic model.",
    patterns: ["DataEnvelope", "Preamble-first UX", "Inline Citation"],
    source: "Outstanding accruals; commitment fee accruals; rate data" },

  { product: "Cashflow Lending", category: "Document Q&A", name: "Credit Agreement Q&A",
    what: "Ask natural-language questions of the credit agreement with cited clauses returned inline, carrying context into any downstream action.",
    patterns: ["Inline Citation", "Cross-screen Continuity"],
    source: "Deal documents (credit agreement)" },

  { product: "ABL", category: "Visibility", name: "Live Borrowing-Base Availability",
    what: "Ask current ABL availability and see eligible AR + inventory × advance rates minus reserves, narrated before the breakdown renders.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "NBP Chips", "Preamble-first UX"],
    source: "Borrowing base certificate data; facility availability; reserves" },

  { product: "ABL", category: "Covenant Management", name: "Borrowing-Base Certificate Reminder",
    what: "Get alerted that the weekly/monthly certificate is due, with a pre-filled summary of last reported figures and a guided submission playbook.",
    patterns: ["Exception Desk", "Standing Deliverables", "Treasury Playbooks"],
    source: "Borrowing base reporting schedule; certificate history" },

  { product: "ABL", category: "Alerts", name: "Excess-Availability / Dominion Trigger Warning",
    what: "Get warned when availability approaches the threshold that triggers cash dominion or springing covenants.",
    patterns: ["Exception Desk", "Ambient Proactive"],
    source: "Availability vs. trigger thresholds; deal terms" },

  { product: "ABL", category: "Analytics", name: "Eligibility & Dilution Impact Simulator",
    what: "Ask how rising AR concentration affects availability — see modeled impact of reserve and dilution changes with scenario chips.",
    patterns: ["DataEnvelope", "NBP Chips"],
    source: "Borrowing base components; reserve/advance-rate definitions" },

  { product: "ABL", category: "Drawdown & Repayment", name: "Collateral-Aware Draw Check",
    what: "Before requesting a draw, confirm it stays within borrowing-base availability — not just facility commitment — with source cited.",
    patterns: ["Next-best-action Card", "Inline Citation"],
    source: "Borrowing base availability; Outstanding balances" },

  { product: "ABL", category: "Visibility", name: "Collateral & Reserve Breakdown",
    what: "View how eligible AR, inventory, advance rates, and reserves combine into the current base — each component cited to its LoanIQ source.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "Inline Citation"],
    source: "Collateral records; advance rates; reserves" },

  { product: "ABL", category: "Document Q&A", name: "Field-Exam / Appraisal Tracker",
    what: "Ask when the next field exam or inventory appraisal is scheduled and view past results, with session continuity into the borrowing base screen.",
    patterns: ["Standing Deliverables", "Cross-screen Continuity"],
    source: "Collateral monitoring schedule; deal terms" },

  { product: "Supply Chain Finance", category: "Visibility", name: "Program Utilization Snapshot",
    what: "Ask how much of the payables-finance program is utilized — program limit, financed amount, and remaining capacity in one narrated answer.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "NBP Chips"],
    source: "Facility/program limit; outstanding financed receivables" },

  { product: "Supply Chain Finance", category: "Drawdown & Repayment", name: "Early-Payment / Discount Decision",
    what: "Review approved invoices eligible for early payment and trigger a financed early payment — delegated to the SCF portal with HiTL approval.",
    patterns: ["Next-best-action Card", "Fire-and-forget"],
    source: "Outstanding (financed invoices); program terms" },

  { product: "Supply Chain Finance", category: "Analytics", name: "DPO / Working-Capital Impact",
    what: "Ask how extending payment terms or funding early payments affects days payable outstanding — narrated output from a deterministic model.",
    patterns: ["DataEnvelope", "Preamble-first UX", "Inline Citation"],
    source: "Program transaction data; payment schedules" },

  { product: "Supply Chain Finance", category: "Alerts", name: "Supplier Onboarding / Maturity Alert",
    what: "Be notified when financed payables are maturing or when suppliers complete onboarding — surfaced proactively without querying.",
    patterns: ["Exception Desk", "Ambient Proactive"],
    source: "Payment due dates; program participant data" },

  { product: "Supply Chain Finance", category: "Visibility", name: "Settlement & Reimbursement Schedule",
    what: "View upcoming dates on which the buyer must reimburse the bank — pushed as a standing delivery at each settlement cycle.",
    patterns: ["DataEnvelope", "Standing Deliverables"],
    source: "Outstanding maturity/settlement dates" },

  { product: "Supply Chain Finance", category: "Document Q&A", name: "Program Terms Q&A",
    what: "Ask about discount-rate basis, financing margin, or eligibility rules — cited clauses returned inline, session continues into utilization screen.",
    patterns: ["Inline Citation", "Cross-screen Continuity"],
    source: "Program agreement documents" },

  { product: "Equipment Finance", category: "Visibility", name: "Lease/Loan Position Overview",
    what: "Ask total outstanding on the equipment loan portfolio and see balances, remaining term, and next payment by contract — with sparkle chips on balance cells.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "NBP Chips"],
    source: "Outstanding balances; repayment schedule" },

  { product: "Equipment Finance", category: "Analytics", name: "Amortization Schedule Explainer",
    what: "View principal/interest split and remaining balance for any payment date — narration leads before the schedule table renders.",
    patterns: ["DataEnvelope", "Preamble-first UX", "Inline Citation"],
    source: "Repayment/amortization schedule; Outstanding" },

  { product: "Equipment Finance", category: "Drawdown & Repayment", name: "Payoff Quote Request",
    what: "Ask for an early-payoff amount as of a chosen date — the assistant shows its work via the activity feed then routes the request.",
    patterns: ["Next-best-action Card", "Fire-and-forget", "Agent Activity Feed"],
    source: "Outstanding balance; accrued interest; prepayment terms" },

  { product: "Equipment Finance", category: "Alerts", name: "Payment Due / Balloon Reminder",
    what: "Receive reminders ahead of installment due dates and balloon/residual payments — balloon treated as a high-stakes exception, not routine.",
    patterns: ["Standing Deliverables", "Exception Desk"],
    source: "Repayment schedule; balloon/residual terms" },

  { product: "Equipment Finance", category: "Visibility", name: "Schedule-Level Drilldown",
    what: "Drill into individual equipment schedules under a master lease/loan — session context carries from the portfolio view into the schedule screen.",
    patterns: ["DataEnvelope", "Cross-screen Continuity", "Inline AI Sparkle"],
    source: "Facility (master agreement); Outstanding (schedules)" },

  { product: "Equipment Finance", category: "Document Q&A", name: "Lease vs. Finance Terms Q&A",
    what: "Ask about end-of-term options and maintenance obligations — cited clauses returned inline with an explain-this-screen overlay on the lease summary.",
    patterns: ["Inline Citation", "Explain-this-screen"],
    source: "Contract documents" },

  { product: "Syndicated Lending", category: "Visibility", name: "Single-Touchpoint Facility View",
    what: "As borrower, get total facility commitment, drawn, and availability across the syndicate in one narrated view — sparkle chips on tranche cells.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "NBP Chips", "Preamble-first UX"],
    source: "Deal commitment; Facility availability; lender shares" },

  { product: "Syndicated Lending", category: "Drawdown & Repayment", name: "Drawdown Notice Submission",
    what: "Submit a drawdown notice to the agent conversationally — conditions-precedent checks before the assistant shows its routing work and delegates.",
    patterns: ["Next-best-action Card", "Fire-and-forget", "Agent Activity Feed"],
    source: "Facility availability; conditions precedent; Outstanding" },

  { product: "Syndicated Lending", category: "Alerts", name: "Rate-Fixing & Interest-Period Notice",
    what: "Get notified of upcoming rate fixings and interest-period ends with applicable Term SOFR per tranche — deterministic calendar drives the push.",
    patterns: ["Ambient Proactive", "Standing Deliverables", "Exception Desk"],
    source: "Rate-setting calendar; interest pricing rules; Outstanding" },

  { product: "Syndicated Lending", category: "Covenant Management", name: "Information-Undertaking Tracker",
    what: "Track recurring reporting obligations to the agent and receive reminders with a submission playbook — ERP systems can push compliance reports via MCP/A2A.",
    patterns: ["Exception Desk", "Standing Deliverables", "Treasury Playbooks", "Two-Sided Endpoint"],
    source: "Covenant/reporting schedule; deal terms" },

  { product: "Syndicated Lending", category: "Visibility", name: "Fee & Accrual Statement",
    what: "Ask for accrued commitment fees, agency fees, and interest by period — narrated before the breakdown renders, each figure cited.",
    patterns: ["DataEnvelope", "Inline Citation", "Preamble-first UX"],
    source: "Fee accruals; interest accruals; Outstanding" },

  { product: "Syndicated Lending", category: "Document Q&A", name: "Amendment / Waiver Status",
    what: "Ask the status of a pending amendment circulating among lenders — monitored as an active exception, session continues into the facility screen.",
    patterns: ["Exception Desk", "Cross-screen Continuity", "Inline Citation"],
    source: "Deal amendment records; transaction history" },

  { product: "Syndicated Lending", category: "Analytics", name: "Tranche-Level Exposure Breakdown",
    what: "View commitment and outstandings by tranche/currency — AI narrates the composition before the breakdown table renders.",
    patterns: ["DataEnvelope", "Inline AI Sparkle", "Preamble-first UX"],
    source: "Facility/tranche commitment; Outstanding by currency" }
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedPattern, setSelectedPattern] = useState("All");

  const allProducts = Object.keys(PRODUCT_COLORS);

  const patternCounts = useMemo(() => {
    const counts = {};
    features.forEach(f => f.patterns.forEach(p => { counts[p] = (counts[p] || 0) + 1; }));
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return features.filter(f => {
      const pm = selectedProduct === "All" || f.product === selectedProduct;
      const ptm = selectedPattern === "All" || f.patterns.includes(selectedPattern);
      return pm && ptm;
    });
  }, [selectedProduct, selectedPattern]);

  const hasFilter = selectedProduct !== "All" || selectedPattern !== "All";

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Vantage AI — Lending Feature Map</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Established Vantage interaction patterns applied to LoanIQ-backed lending products &middot; {features.length} features across 5 products
          </p>
        </div>

        {/* Pattern legend / filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Filter by Vantage Pattern</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {Object.entries(PATTERN_CATEGORIES).map(([cat, patterns]) => (
              <div key={cat}>
                <p className="text-xs text-gray-400 font-medium mb-1.5">{cat}</p>
                <div className="flex flex-wrap gap-1">
                  {patterns.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPattern(selectedPattern === p ? "All" : p)}
                      className={`text-xs px-2.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                        PATTERN_COLORS[p]
                      } ${
                        selectedPattern === p
                          ? "ring-2 ring-gray-500 ring-offset-1 font-bold"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      {p}
                      <span className="ml-1 opacity-50 text-xs">({patternCounts[p] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product filter + clear */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-medium text-gray-400">Product:</span>
          {["All", ...allProducts].map(p => (
            <button
              key={p}
              onClick={() => setSelectedProduct(p)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                selectedProduct === p
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {p}
            </button>
          ))}
          {hasFilter && (
            <button
              onClick={() => { setSelectedProduct("All"); setSelectedPattern("All"); }}
              className="text-xs text-blue-500 hover:text-blue-700 ml-1 underline"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} of {features.length} features
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Feature</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">What the user can do</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Vantage Patterns Applied</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">LoanIQ Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRODUCT_COLORS[f.product]}`}>
                        {f.product}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{f.category}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{f.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 leading-relaxed max-w-xs">{f.what}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {f.patterns.map(p => (
                          <span
                            key={p}
                            className={`text-xs px-2 py-0.5 rounded-full ${PATTERN_COLORS[p]} ${
                              selectedPattern === p ? "ring-1 ring-offset-1 ring-gray-500 font-bold" : ""
                            }`}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 leading-relaxed max-w-xs">{f.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                No features match the selected filters.
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          Patterns derived from Vantage AI Assistant design work (Cash / Payments / FX / AP-AR domains) — applied here for the first time to LoanIQ-backed lending products
        </p>
      </div>
    </div>
  );
}
