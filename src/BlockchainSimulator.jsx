import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, X } from "lucide-react";
import "./index.css";

const BlockchainSimulator = () => {
  const [blocks, setBlocks] = useState([]);
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const documentTypes = [
    {
      type: "INSTALACIÓN_ELÉCTRICA",
      subtype: ["Cableado Principal", "Instalación Transformador", "Conexiones 220V"],
      color: "bg-yellow-500",
      icon: "⚡",
    },
    {
      type: "PERMISO_CONSTRUCCIÓN",
      subtype: ["Uso de Suelo", "Impacto Ambiental", "Licencia Construcción"],
      color: "bg-blue-500",
      icon: "📋",
    },
    {
      type: "ENTREGA_MATERIAL",
      subtype: ["Cemento", "Varillas", "Blocks"],
      color: "bg-green-500",
      icon: "🚛",
    },
    {
      type: "INSPECCIÓN_OBRA",
      subtype: ["Estructural", "Sanitaria", "Seguridad"],
      color: "bg-purple-500",
      icon: "🔍",
    },
    {
      type: "PAGO_CONTRATISTA",
      subtype: ["Mano de Obra", "Materiales", "Servicios"],
      color: "bg-red-500",
      icon: "💰",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => [...prev, generateBlock(prev)]);
      simulateTransaction();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateBlock = (prevBlocks) => {
    const transactions = Array(3)
      .fill()
      .map(() => {
        const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        return {
          type: docType.type,
          subtype: docType.subtype[Math.floor(Math.random() * docType.subtype.length)],
          icon: docType.icon,
          timestamp: new Date().toISOString(),
          hash: Math.random().toString(36).substring(7),
          monto: `$${Math.floor(Math.random() * 50000 + 1000)}`,
        };
      });

    return {
      id: Date.now(),
      transactions,
      prevHash: prevBlocks[prevBlocks.length - 1]?.hash || "0000",
      hash: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
    };
  };

  const simulateTransaction = () => {
    setActiveTransaction(documentTypes[Math.floor(Math.random() * documentTypes.length)]);
    setTimeout(() => setActiveTransaction(null), 2000);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tabula: CEMEX Blockchain</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {documentTypes.map((doc) => (
            <div key={doc.type} className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
              <span className="text-xl">{doc.icon}</span>
              <div className={`w-3 h-3 rounded-full ${doc.color}`}></div>
              <span className="text-sm">{doc.type.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            {index < blocks.length - 1 && (
              <ArrowRight className="absolute -right-6 top-1/2 transform -translate-y-1/2" />
            )}
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-200 rounded px-2 py-1 text-sm">Bloque #{index + 1}</div>
                <CheckCircle className="text-green-500" size={16} />
                <div className="text-xs text-gray-500">
                  {new Date(block.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {block.transactions.map((tx, i) => (
                <div
                  key={tx.hash}
                  className="mb-2 p-3 rounded bg-gray-50 flex items-center gap-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleTransactionClick(tx)}
                >
                  <span className="text-xl">{tx.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{tx.type.replace("_", " ")}</div>
                    <div className="text-xs text-gray-600">{tx.subtype}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{tx.monto}</div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <div>Hash: {block.hash.substring(0, 8)}...</div>
                <div>Prev: {block.prevHash.substring(0, 8)}...</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTransaction && (
        <div className="fixed bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg animate-bounce flex items-center gap-2">
          <span className="text-xl">{activeTransaction.icon}</span>
          <span>Nueva Transacción: {activeTransaction.type.replace("_", " ")}</span>
        </div>
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Detalles de la Transacción</h2>
              <button onClick={closeModal}>
                <X className="text-gray-500 hover:text-gray-800" />
              </button>
            </div>
            <div className="text-sm">
              <p><strong>Tipo:</strong> {selectedTransaction.type.replace("_", " ")}</p>
              <p><strong>Subtipo:</strong> {selectedTransaction.subtype}</p>
              <p><strong>Monto:</strong> {selectedTransaction.monto}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedTransaction.timestamp).toLocaleString()}</p>
              <p><strong>Hash:</strong> {selectedTransaction.hash}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainSimulator;