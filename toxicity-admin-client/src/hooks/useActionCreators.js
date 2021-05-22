import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

const useActionCreators = (creators) => {
	const dispatch = useDispatch();

	return useMemo(() => creators.map(creator => (...params) => dispatch(creator(...params))), [ ...creators ]);
};

export default useActionCreators;
