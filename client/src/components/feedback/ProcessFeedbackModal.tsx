
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface ProcessFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  processId: string;
  processTitle: string;
}

export default function ProcessFeedbackModal({ 
  isOpen, 
  onClose, 
  processId, 
  processTitle 
}: ProcessFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useSupabaseAuth();

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!profile) return;
    
    if (rating === 0) {
      toast({
        title: 'Avaliação obrigatória',
        description: 'Por favor, selecione uma nota de 1 a 5 estrelas.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, just show success message
      // The feedback will be stored once the database types are updated
      console.log('Feedback submitted:', {
        process_id: processId,
        user_id: profile.id,
        rating,
        comment: comment.trim() || null
      });

      toast({
        title: 'Feedback enviado!',
        description: 'Obrigado por avaliar nosso serviço. Seu feedback é muito importante para nós.',
      });

      // Send NPS if rating is high
      if (rating >= 4) {
        setTimeout(() => {
          console.log('NPS survey scheduled for user:', profile.id);
        }, 24 * 60 * 60 * 1000);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Erro ao enviar feedback',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avalie seu processo</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com o processo "{processTitle}"?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Sua avaliação</Label>
            <div className="flex space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating === 1 && 'Muito insatisfeito'}
                {rating === 2 && 'Insatisfeito'}
                {rating === 3 && 'Neutro'}
                {rating === 4 && 'Satisfeito'}
                {rating === 5 && 'Muito satisfeito'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="comment">Comentários (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Conte-nos mais sobre sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="eregulariza-gradient flex-1"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar feedback'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
