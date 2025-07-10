
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FAQSearchProps {
  faqs: FAQItem[];
}

const categories = [
  'Todos',
  'Processo',
  'Documentos',
  'Pagamento',
  'Prazos',
  'Plataforma'
];

export default function FAQSearch({ faqs }: FAQSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchTerm, selectedCategory]);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Busque por uma pergunta, palavra-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "eregulariza-gradient" : ""}
          >
            {category}
          </Button>
        ))}
        {(searchTerm || selectedCategory !== 'Todos') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredFAQs.length} pergunta{filteredFAQs.length !== 1 ? 's' : ''} encontrada{filteredFAQs.length !== 1 ? 's' : ''}
      </div>

      {/* FAQ Results */}
      {filteredFAQs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                <div className="flex flex-col items-start space-y-2">
                  <span>{faq.question}</span>
                  <div className="flex space-x-1">
                    <Badge variant="secondary" className="text-xs">
                      {faq.category}
                    </Badge>
                    {faq.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Nenhuma pergunta encontrada para os filtros selecionados.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSearch}
            className="mt-2"
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
