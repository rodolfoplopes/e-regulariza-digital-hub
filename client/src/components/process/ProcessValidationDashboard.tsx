
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProcesses } from "@/hooks/useProcesses";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { CheckCircle, Clock, AlertTriangle, User, FileText, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProcessValidationDashboard() {
  const { profile } = useSupabaseAuth();
  const { processes, isLoading } = useProcesses();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'em_andamento':
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'em_andamento':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluido':
      case 'completed':
        return 'Concluído';
      case 'em_andamento':
      case 'in_progress':
        return 'Em Andamento';
      default:
        return 'Pendente';
    }
  };

  const canEditProcess = (process: any) => {
    // Cliente não pode editar processos
    if (profile?.role === 'cliente') {
      return false;
    }
    // Admin pode editar todos os processos
    return profile?.role === 'admin' || profile?.role === 'admin_master' || profile?.role === 'admin_editor';
  };

  const canCreateProcess = () => {
    return profile?.role === 'admin' || profile?.role === 'admin_master' || profile?.role === 'admin_editor';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eregulariza-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-eregulariza-gray font-montserrat">
            {profile?.role === 'cliente' ? 'Meus Processos' : 'Gestão de Processos'}
          </h2>
          <p className="text-eregulariza-description">
            {profile?.role === 'cliente' 
              ? 'Acompanhe o andamento dos seus processos de regularização'
              : 'Gerencie todos os processos de regularização dos clientes'
            }
          </p>
        </div>
        
        {canCreateProcess() && (
          <Button
            onClick={() => navigate('/admin/novo-processo')}
            className="eregulariza-gradient btn-eregulariza-hover text-white"
          >
            Criar Novo Processo
          </Button>
        )}
      </div>

      {processes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {profile?.role === 'cliente' ? 'Nenhum processo encontrado' : 'Nenhum processo cadastrado'}
            </h3>
            <p className="text-gray-500">
              {profile?.role === 'cliente' 
                ? 'Você ainda não possui processos de regularização.'
                : 'Comece criando o primeiro processo para um cliente.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map((process) => (
            <Card key={process.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold text-eregulariza-gray line-clamp-2">
                    {process.title}
                  </CardTitle>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(process.status)}`}>
                    {getStatusIcon(process.status)}
                    {getStatusText(process.status)}
                  </Badge>
                </div>
                <p className="text-sm text-eregulariza-description">
                  #{process.process_number}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Cliente (só para admin) */}
                {profile?.role !== 'cliente' && process.client && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-eregulariza-primary" />
                    <span className="text-eregulariza-description">
                      {process.client.name}
                    </span>
                  </div>
                )}

                {/* Tipo do processo */}
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-eregulariza-primary" />
                  <span className="text-eregulariza-description">
                    {process.process_type?.name || 'Tipo não definido'}
                  </span>
                </div>

                {/* Data de criação */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-eregulariza-primary" />
                  <span className="text-eregulariza-description">
                    Criado em {new Date(process.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Progresso */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-eregulariza-description">Progresso</span>
                    <span className="font-medium text-eregulariza-gray">{process.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-eregulariza-primary to-eregulariza-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${process.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Próxima ação */}
                {process.status !== 'concluido' && process.status !== 'completed' && (
                  <div className="p-2 bg-eregulariza-surface rounded text-sm">
                    <span className="font-medium text-eregulariza-gray">Próxima ação:</span>
                    <p className="text-eregulariza-description mt-1">
                      {process.status === 'pendente' 
                        ? 'Aguardando início do processo'
                        : 'Em análise pela equipe técnica'
                      }
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={() => navigate(`/processo/${process.id}`)}
                    variant="outline"
                    className="w-full border-eregulariza-primary text-eregulariza-primary hover:bg-eregulariza-primary hover:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
