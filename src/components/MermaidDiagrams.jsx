import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MermaidDiagrams() {
  const [expandedDiagram, setExpandedDiagram] = useState('architecture');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadMermaid = async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.mermaid !== 'undefined') {
          window.mermaid.initialize({ startOnLoad: true, theme: 'dark' });
          window.mermaid.contentLoaded();
          setLoaded(true);
        }
      };
      document.body.appendChild(script);
    };

    if (!window.mermaid) {
      loadMermaid();
    } else {
      setLoaded(true);
    }
  }, []);

  const diagrams = [
    {
      id: 'architecture',
      title: 'System Architecture & Data Flow',
      code: `graph LR
    A["🌐 verkko.ai<br/>User Actions"] -->|Data Layer| B["📊 Browser"]
    B -->|Events| C["🏷️ Google Tag Manager"]
    C -->|Sign-up| D1["✓ LinkedIn Tag"]
    C -->|Registration| D2["✓ LinkedIn Tag"]
    C -->|Form| D3["✓ LinkedIn Tag"]
    D1 --> E["📈 LinkedIn<br/>Campaign Manager"]
    D2 --> E
    D3 --> E
    E --> F["💹 Analytics"]
    
    style A fill:#1e40af
    style B fill:#6366f1
    style C fill:#8b5cf6
    style D1 fill:#06b6d4
    style D2 fill:#06b6d4
    style D3 fill:#06b6d4
    style E fill:#0891b2
    style F fill:#059669`
    },
    {
      id: 'events',
      title: 'Conversion Events Map',
      code: `graph LR
    A1["🔐 Sign-up<br/>sign_up"] --> B1["Conversion ID"]
    A2["📅 Registration<br/>event_registration"] --> B2["Conversion ID"]
    A3["📝 Form<br/>form_submission"] --> B3["Conversion ID"]
    A4["👁️ Pageview<br/>page_view"] --> B4["Insight Tag"]
    
    B1 --> C["📊 LinkedIn"]
    B2 --> C
    B3 --> C
    B4 --> C
    
    style A1 fill:#1e40af
    style A2 fill:#1e40af
    style A3 fill:#1e40af
    style A4 fill:#1e40af
    style C fill:#06b6d4`
    },
    {
      id: 'gtm-config',
      title: 'GTM Configuration',
      code: `graph TD
    A["📥 Data Layer"] --> B["⚙️ Variables"]
    B --> C["🔔 Triggers"]
    C --> D["✅ Tags"]
    D --> E["🎯 LinkedIn"]
    
    style A fill:#06b6d4
    style B fill:#8b5cf6
    style C fill:#3b82f6
    style D fill:#10b981
    style E fill:#059669`
    },
    {
      id: 'timeline',
      title: 'Implementation Timeline',
      code: `timeline
    Phase 1 : GTM Setup : Create account : Install snippet
    Phase 2 : Events : Code tracking : Test events
    Phase 3 : Tags : Create variables : Create triggers
    Phase 4 : LinkedIn : Insight Tag : Conversion rules
    Phase 5 : Testing : Preview mode : DevTools check
    Phase 6 : Launch : Publish : Monitor`
    }
  ];

  const MermaidRenderer = ({ code }) => {
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
      if (loaded && window.mermaid) {
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = code;
          window.mermaid.run();
        }
      }
    }, [code, loaded]);

    return (
      <div className="bg-slate-900 rounded-lg p-8 border border-slate-700/50 overflow-x-auto">
        <div id={id} className="mermaid">{code}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Diagram Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {diagrams.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => setExpandedDiagram(diagram.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              expandedDiagram === diagram.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-700/30 hover:bg-slate-700/50'
            }`}
          >
            <h3 className="font-bold text-slate-100 text-sm">{diagram.title}</h3>
          </button>
        ))}
      </div>

      {/* Diagram Display */}
      {diagrams.map((diagram) => (
        expandedDiagram === diagram.id && (
          <div key={diagram.id}>
            <h2 className="text-2xl font-bold mb-4 text-slate-100">{diagram.title}</h2>
            {loaded ? (
              <MermaidRenderer code={diagram.code} />
            ) : (
              <div className="bg-slate-900 rounded-lg p-12 border border-slate-700/50 text-center">
                <p className="text-slate-400">Loading diagram...</p>
              </div>
            )}
          </div>
        )
      ))}

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="font-bold text-blue-300 mb-3">💡 How to Read</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Arrows show data flow</li>
            <li>• Colors represent different stages</li>
            <li>• Boxes are system components</li>
          </ul>
        </div>

        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="font-bold text-green-300 mb-3">✅ Key Points</h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>• Data layer must be first</li>
            <li>• GTM orchestrates everything</li>
            <li>• LinkedIn receives conversions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
