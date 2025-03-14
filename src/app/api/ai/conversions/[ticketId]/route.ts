import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../utils/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const supabase = createClient();
    
    const { data: conversions, error } = await supabase
      .from('recipe_conversions')
      .select('*')
      .eq('ticket_id', params.ticketId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ conversions });
  } catch (error) {
    console.error('Error fetching conversions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversions' },
      { status: 500 }
    );
  }
}
